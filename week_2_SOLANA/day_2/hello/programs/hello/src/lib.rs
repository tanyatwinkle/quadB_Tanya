use anchor_lang::prelude::*;

declare_id!("7Hk2d4XUy4YWDwgcfZ8QrrTWAJ2YcTtw5b4zA1yjc81d");

#[program]
pub mod hello {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
