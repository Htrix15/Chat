using ChatProject.Interfaces;
using ChatProject.ServicesClasses;
using System;

namespace ChatProject.RequestValidators.Rules
{
    public class StringIsInt: IValidateRules
    {
        public string Check(string value){
            if(Int32.TryParse(value, out int outInt)){
                return null;
            }
            return "string isn't number";
        }
    }
}