using ChatProject.Interfaces;
using ChatProject.ServicesClasses;
using System;

namespace ChatProject.RequestValidators.Rules
{
    public class StringIsInt: IValidateRules
    {
        public string Check(string value){
            if(Boolean.TryParse(value, out bool outBool)){
                return null;
            }
            return "string isn't boolean";
        }
    }
}