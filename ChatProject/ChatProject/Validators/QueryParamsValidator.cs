using ChatProject.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using ChatProject.Models;

namespace ChatProject.Validators
{
    public class QueryParamsValidator: IValidator
    {
        private List<IValidateQueryParamsRules> rules;

        public QueryParamsValidator(params IValidateQueryParamsRules[] rules){
            if(rules.Length>0){
                this.rules = new List<IValidateQueryParamsRules>();
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
    }
}