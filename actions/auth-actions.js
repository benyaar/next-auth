'use server';
export async function signup(prevState, formData){
    const email = formData.get('email')
    const password = formData.get('password')
    let errors = {}
    if(!email.includes('@')){
        errors.email = 'No valid email'
    }
    if(password.trim().length < 8){
        errors.password = 'No valid password'
    }
    if(Object.keys(formState.errors).length > 0 ){
        return {
            errors
        }
    }
    
}