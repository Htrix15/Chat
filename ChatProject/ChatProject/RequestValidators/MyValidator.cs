using ChatProject.Interfaces;
using ChatProject.ServicesClasses;
using Microsoft.AspNetCore.Http;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using ChatProject.Models;
namespace ChatProject.RequestValidators
{
    public class MyValidator: IValidator
    {
        private List<IValidateRules> rules;

        public MyValidator(params IValidateRules[] rules){
            if(rules.Length>0){
                this.rules = new List<IValidateRules>();
                foreach(var rule in rules){
                    this.rules.Add(rule);
                }
            }
        }
        public DataShell Validate(IQueryCollection requestParams)
        {
            if(this.rules!=null){
                foreach(var rule in this.rules){
                    var error = rule.Check(requestParams);
                    if(error!=null){
                        return new DataShell(error);
                    }
                }
            }
            return new DataShell();
        }
        public DataShell Validate(string value){
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