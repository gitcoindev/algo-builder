from pyteal import *

def single_transaction_deposit_approval_program():
    '''
    Implementation of a contract that can hold Custom ASA (Algorand Standard
    Asset) Tokens, where ASA deposits are achieved using a single transaction
    with rekeyTo field.

    The contract allows to opt-in to receive custom ASA tokens in a separate
    transaction, but for demonstration purposes it is able to automatically
    opt-in thanks to rekeyTo provided.

    The contract also tracks the total number of ASA deposits.
    '''

    on_create = Seq([
        App.globalPut(Bytes("contract_creator"), Txn.sender()),
        App.globalPut(Bytes("deposits_counter"), Int(0)),
        Return(Int(1))  # Success
    ])

    on_asa_deposit = Seq([
         # submit opt-in transaction by App
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields(
            {
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.xfer_asset: Btoi(Txn.application_args[1]),
                TxnField.asset_receiver: Global.current_application_address(),
                TxnField.asset_amount: Int(0),
                # fees should be paid/pooled by main transaction
                TxnField.fee: Int(0)
            }
        ),
        InnerTxnBuilder.Submit(),
        # Compile inner ASA transfer transaction from user's account into smart contract
        # and give back authority to the user by setting rekey_to field to the user's address
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.sender: Txn.sender(),
            TxnField.asset_receiver: Global.current_application_address(),  # to be received by the smart contract
            TxnField.asset_amount: Btoi(Txn.application_args[2]),
            TxnField.xfer_asset: Btoi(Txn.application_args[1]),  # asset id
            TxnField.fee: Int(0),  # inner transaction fee is set to zero, fees to be paid by the main transaction
            TxnField.rekey_to: Txn.sender(),  # give authority back to the sender
        }),
        InnerTxnBuilder.Submit(),
        # Increase deposits counter
        App.globalPut(
            Bytes("deposits_counter"), 
            App.globalGet(Bytes("deposits_counter")) + Int(1)),
        Return(Int(1))  # Success
    ])

    # Check if current call transaction is ASA deposit into contract
    on_call = Seq(
        Assert(Global.group_size() == Int(1)),  # make sure that the transaction is not grouped with others
        Assert(Txn.application_args.length() == Int(3)),  # and application call contains three arguments
        Assert(Txn.rekey_to() == Global.current_application_address()),  # make sure that the transaction rekey value is valid
        Cond(
            [Txn.application_args[0] == Bytes("asa_deposit"), on_asa_deposit]
        )
    )

    # Smart contract execution flow
    program = Cond(
        [Txn.application_id() == Int(0), on_create],  # called if smart contract not deployed yet, then application_id == 0
        [Txn.on_completion() == OnComplete.DeleteApplication, Return(Int(0))],  # Do not allow delete or update
        [Txn.on_completion() == OnComplete.UpdateApplication, Return(Int(0))],  # for security purposes
        [Txn.on_completion() == OnComplete.CloseOut, Return(Int(0))],  # Opt-out from CloseOut
        [Txn.on_completion() == OnComplete.OptIn, Return(Int(1))],  # Allow to opt-in to receive an ASA
        [Txn.on_completion() == OnComplete.NoOp, on_call],  # The NoOp transaction type are all the generic calls to an app
    )

    return program

if __name__ == "__main__":
    print(compileTeal(single_transaction_deposit_approval_program(), Mode.Application, version = 6))