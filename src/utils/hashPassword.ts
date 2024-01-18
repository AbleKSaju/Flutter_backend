import bcrypt from 'bcrypt';

 const hashPassword = async (password: string): Promise<string> => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw new Error('Error hashing password');
    }
  };

  export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
      const match = await bcrypt.compare(password, hashedPassword);
      return match;
    } catch (error) {
      throw new Error('Error verifying password');
    }
  };
  
  export default hashPassword