const MESSAGES = {
        EMAILS: {
            FORGOT_PASSWORD_EMAIL_SUBJECT: "Password Reset",
        },
        SUCCESS: {
            LOGGED_IN_SUCCESSFULLY: "Logged in Successfully",
            PASSWORD_UPDATED_SUCCESSFULLY: "Password updated successfully",
            FORGOT_PASSWORD_EMAIL: "An email has been sent to your email address",
            LOGGED_OUT_SUCCESSFULLY: "Logged out successfully",
            PASSWORD_UPDATED_SUCCESSFULLY: "Password update successfully",
            VERIFY_CODE_VALID: "Verification code is valid.",
            CREATED_SUCCESSFULLY: "Created successfully",
            UPDATED_SUCCESSFULLY: 'Updated successfully',
            DELETED_SUCCESSFULLY: 'Deleted successfully',
            LISTING_FOUND: 'Listing found',
            GET_SINGLE_SUCCESSFULLY: 'Get single successfully'
        },
        ERRORS: {
            SOMETHING_WENT_WRONG: "Something went wrong",
            ALREADY_EXIST: "Already exist",
            USER_NOT_FOUND: "User not found",
            INVALID_CREDENTIALS: "Invalid credentials",
            EMAIL_NOT_FOUND: "Email not found",
            CAN_NOT_USE_OLD_PASSWORD: "Your new password must be different from the previous password",
            OLD_PASSWORD_NOT_ALLOWED: "Old password not allowed",
            INVALID_TOKEN: 'Invalid token',
            LOGGED_IN_SUCCESSFULLY: 'Logged in successfully',
            EXPIRED_CODE: 'Verification code has expired',
            INVALID_VERIFICATION_CODE: 'Invalid verification code',
            NOT_AUTHORIZED: 'Not Authorized'
        }
}

module.exports = MESSAGES;