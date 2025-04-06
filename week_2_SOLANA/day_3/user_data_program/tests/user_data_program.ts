import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { UserDataProgram } from "../target/types/user_data_program";
import { Keypair, SystemProgram, PublicKey } from "@solana/web3.js";
import { assert } from "chai";

describe("User Data Program Test", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.UserDataProgram as Program<UserDataProgram>;

  it("Initialize user data", async () => {
    const userDataAccount = Keypair.generate();
    
    const username = "satoshi";
    const bio = "Blockchain enthusiast";
    const age = 30;
    
    const tx = await program.methods
      .initialize(username, bio, age)
      .accounts({
        userData: userDataAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([userDataAccount])
      .rpc();
    
    console.log(`Transaction signature: ${tx}`);
    
    const fetchedUserData = await program.account.userData.fetch(userDataAccount.publicKey);
    
    console.log("On-chain data:", {
      username: fetchedUserData.username,
      bio: fetchedUserData.bio,
      age: fetchedUserData.age
    });
    
    assert.equal(fetchedUserData.username, username);
    assert.equal(fetchedUserData.bio, bio);
    assert.equal(fetchedUserData.age, age);
  });
  
  it("Update user data", async () => {
    const userDataAccount = Keypair.generate();
    
    let username = "satoshi";
    let bio = "Blockchain enthusiast";
    let age = 30;
    
    await program.methods
      .initialize(username, bio, age)
      .accounts({
        userData: userDataAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([userDataAccount])
      .rpc();
    
    username = "vitalik";
    bio = "Smart contract developer";
    age = 28;
    
    const updateTx = await program.methods
      .update(username, bio, age)
      .accounts({
        userData: userDataAccount.publicKey,
        user: provider.wallet.publicKey,
      })
      .rpc();
    
    console.log(`Update transaction signature: ${updateTx}`);
    
    const updatedUserData = await program.account.userData.fetch(userDataAccount.publicKey);
    
    assert.equal(updatedUserData.username, username);
    assert.equal(updatedUserData.bio, bio);
    assert.equal(updatedUserData.age, age);
  });
});
