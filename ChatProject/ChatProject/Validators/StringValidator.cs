using ChatProject.Interfaces;
using System.Collections.Generic;
using ChatProject.Models;

namespace ChatProject.Validators
{
    public class StringValidator: IValidator
    {
        private List<IValidateStringRules> rules;
        public StringValidator(params IValidateStringRules[] rules){
            if(rules.Length>0){
                this.rules = new List<IValidateStringRules>();
                foreach(var rule in rules){
                    this.rules.Add(rule);
                }
            }
        }
        public DataShell Validate(string value)
        {
            if(this.rules!=null){
                foreach(var rule in this.rules){
                    var error = rule.Check(value);
                    if(error!=null){
                        return new DataShell(error);
                    }
                }
            }
            return new DataShell();
        }
    }
}