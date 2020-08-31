using ChatProject.Interfaces;
using ChatProject.ServicesClasses;
using Microsoft.AspNetCore.Http;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Linq;

namespace ChatProject.RequestValidators.Rules
{
    public class IfContainsThenMatch: IValidateRules
    {
        private string key;
        private string[] options;
        public IfContainsThenMatch(string key, params string[] options){
            this.key = key;
            this.options = options;
        }
        public string Check(IQueryCollection requestParams){
            if(requestParams.ContainsKey(key)){
                if(options.Contains(requestParams[key].ToString())){
                    return null;
                } else{
                    return $"query key {key} value isn't valid";
                }
            }
            else{
                return null;
            }
        }
    }
}