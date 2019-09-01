export class Register {
    public Email: string;
    public Password: string;
    public ConfirmPassword: string;
}

export class ConfirmPassword {
    public Code: string;
    public Password: string;
}

export class Login {
    public Email: string;
    public Password: string;
    public Country: string;
    public IpAddress: string;
}

export class ForgotPassword {
    public Email: string;
}

export class ResetPassword {
    public Email: string;
    public Password: string;
    public ConfirmPassword: string;
    public Code: string;
}

export class ChangePassword {
    public OldPassword: string;
    public NewPassword: string;
    public ConfirmPassword: string;
}

export class Profile {
    public Email: string;
    public MobileNo: string;
    public FirstName: string;
    public LastName: string;
    public State: string;
    public CountryId: number;
}

export class DisableTwoFactor {
    public Email: string;
    public Code: string;
}

export class VerifyTwoFactor {
    public UserId: number;
    public Code: number;
}

export class ContactUs {
    public Name: string;
    public Email: string;
    public Message: string;
}

export class NewsLetter {
    public Email: string;
}
