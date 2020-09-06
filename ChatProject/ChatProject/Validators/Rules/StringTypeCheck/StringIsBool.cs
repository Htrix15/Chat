using ChatProject.Interfaces;
using System;

namespace ChatProject.Validators.Rules.StringTypeCheck
{
    public class StringIsBool: IValidateStringRules
    {
        public string Check(string value){
            if(Boolean.TryParse(value, out bool outBool)){
                return null;
            }
            return "string isn't boolean";
        }
    }
}