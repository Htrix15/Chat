using ChatProject.Interfaces;
using ChatProject.ServicesClasses;
using System;

namespace ChatProject.Validators.Rules.StringTypeCheck
{
    public class StringIsInt: IValidateStringRules
    {
        public string Check(string value){
            if(Int32.TryParse(value, out int outInt)){
                return null;
            }
            return "string isn't number";
        }
    }
}