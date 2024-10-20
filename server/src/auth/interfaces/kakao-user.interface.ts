export class KakaoUser{
    id: string;
    kakao_account: {
        is_email_valid: boolean;
        is_email_verified: boolean;
        email: string;
    };
}