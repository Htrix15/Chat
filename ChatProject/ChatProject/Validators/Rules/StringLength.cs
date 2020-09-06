using ChatProject.Interfaces;

namespace ChatProject.Validators.Rules
{
    public class StringLength: IValidateStringRules
    {
        int minLength;
        int maxLength;
        public StringLength(int maxLength=100, int minLength=1){
            this.maxLength = maxLength;
            this.minLength =  minLength;
        }
        public string Check(string value){
        if(value.Length>=minLength && value.Length<=maxLength){
            return null;
        }
        return "string isn't number";
        }
    }
}