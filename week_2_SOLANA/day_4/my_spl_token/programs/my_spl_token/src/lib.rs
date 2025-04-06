use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, Mint, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("HYMLfFwNHCS3HbmYBmuuG8bEqezftcsPSMa5BZhW4LGJ");

#[program]
pub mod my_spl_token {
    use super::*;

    pub fn initialize_mint(
        ctx: Context<InitializeMintAccount>, 
        name: String,
        symbol: String,
        decimals: u8
    ) -> Result<()> {
        // The mint is now initialized by Anchor, so we don't need to call initialize_mint
        msg!("Token mint initialized: {}", name);
        msg!("Symbol: {}", symbol);
        Ok(())
    }

    pub fn mint_token(ctx: Context<MintTokenAccount>, amount: u64) -> Result<()> {
        token::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.token_account.to_account_info(),
                    authority: ctx.accounts.authority.to_account_info(),
                },
            ),
            amount,
        )?;
        
        msg!("Minted {} tokens", amount);
        
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String, symbol: String, decimals: u8)]
pub struct InitializeMintAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    #[account(
        init,
        payer = payer,
        mint::decimals = decimals,
        mint::authority = payer,
        seeds = [b"token_mint"],
        bump
    )]
    pub mint: Account<'info, Mint>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct MintTokenAccount<'info> {
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"token_mint"],
        bump,
    )]
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        constraint = token_account.mint == mint.key(),
        constraint = token_account.owner == authority.key()
    )]
    pub token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}
