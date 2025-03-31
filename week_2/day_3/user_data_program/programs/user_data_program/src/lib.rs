use anchor_lang::prelude::*;

declare_id!("GovJFCs6mVdCzDqKFYCQugwW6QVNQAKanfSUq5hXtdzQ");
 
#[program]
mod user_data_program {
    use super::*;

    pub fn initialize(ctx: Context<InitializeUserData>, username: String, bio: String, age: u8) -> Result<()> {
        let user_data = &mut ctx.accounts.user_data;
        user_data.username = username;
        user_data.bio = bio;
        user_data.age = age;
        
        msg!("User data initialized successfully!");
        Ok(())
    }

    pub fn update(ctx: Context<UpdateUserData>, username: String, bio: String, age: u8) -> Result<()> {
        let user_data = &mut ctx.accounts.user_data;
        user_data.username = username;
        user_data.bio = bio;
        user_data.age = age;
        
        msg!("User data updated successfully!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeUserData<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 256 + 1 // 8 bytes discriminator + username + bio + age
    )]
    pub user_data: Account<'info, UserData>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateUserData<'info> {
    #[account(mut)]
    pub user_data: Account<'info, UserData>,
    pub user: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct UserData {
    #[max_len(50)]
    pub username: String,
    #[max_len(200)] 
    pub bio: String,
    pub age: u8,
}

