import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CounterProgram } from "../target/types/counter_program";
import { expect } from "chai";

describe("counter_program", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.CounterProgram as Program<CounterProgram>;

  it("Initializes the counter", async () => {
    const counter = anchor.web3.Keypair.generate();
    await program.methods
      .initialize()
      .accounts({
        counter: counter.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([counter])
      .rpc();

    const counterAccount = await program.account.counter.fetch(counter.publicKey);
    expect(counterAccount.count.toNumber()).to.equal(0);
  });

  it("Increments the counter", async () => {
    const counter = anchor.web3.Keypair.generate();
    await program.methods
      .initialize()
      .accounts({
        counter: counter.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([counter])
      .rpc();

    await program.methods
      .increment()
      .accounts({
        counter: counter.publicKey,
      })
      .rpc();

    const counterAccount = await program.account.counter.fetch(counter.publicKey);
    expect(counterAccount.count.toNumber()).to.equal(1);
  });
});
