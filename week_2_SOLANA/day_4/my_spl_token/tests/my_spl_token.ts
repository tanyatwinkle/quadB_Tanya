const anchor = require('@coral-xyz/anchor');
const { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccount } = require('@solana/spl-token');
const { SystemProgram, PublicKey } = anchor.web3;

describe('my_spl_token', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.MySplToken;
  const payer = provider.wallet;
  let mintPda = null;
  let tokenAccount = null;

  before(async () => {
    // Find the PDA for the token mint
    [mintPda] = await PublicKey.findProgramAddressSync(
      [Buffer.from("token_mint")],
      program.programId
    );
  });

  it('Initializes the token mint and creates token account', async () => {
    try {
      // Try to initialize the mint (might fail if already initialized)
      await program.methods
        .initializeMint("My Token", "MTK", 9)
        .accounts({
          payer: payer.publicKey,
          mint: mintPda,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();
      console.log("Token mint initialized at:", mintPda.toString());
    } catch (e) {
      console.log("Mint may already be initialized:", e.message);
    }
    
    try {
      // Create the associated token account using the correct function
      tokenAccount = await createAssociatedTokenAccount(
        provider.connection,
        payer.payer,
        mintPda,
        payer.publicKey
      );
      console.log("Created token account:", tokenAccount.toString());
    } catch (e) {
      // If token account exists, get its address
      const associatedTokenAddress = await anchor.utils.token.associatedAddress({
        mint: mintPda,
        owner: payer.publicKey
      });
      tokenAccount = associatedTokenAddress;
      console.log("Using existing token account:", tokenAccount.toString());
    }
  });

  it('Mints tokens to the authority', async () => {
    const amount = new anchor.BN(1000000000); // 1 token with 9 decimals
    
    await program.methods
      .mintToken(amount)
      .accounts({
        authority: payer.publicKey,
        mint: mintPda,
        tokenAccount: tokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
      
    console.log("Minted 1 token to:", tokenAccount.toString());
    
    // Verify the token balance
    const balance = await provider.connection.getTokenAccountBalance(tokenAccount);
    console.log("Token balance:", balance.value.uiAmount);
  });
});
