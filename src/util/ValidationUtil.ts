

class Validate{
    validateEmail = ($email:string)=>{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test($email);
    }
}

const ValidationUtil = new Validate();

export default ValidationUtil;