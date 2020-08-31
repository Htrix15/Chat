using ChatProject.Interfaces;
using ChatProject.ServicesClasses;
using Microsoft.AspNetCore.Http;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Linq;
using System;

namespace ChatProject.RequestValidators.Rules
{
    public class IfContainsThenIsBool: IValidateRules
    {
        private string key;
        public IfContainsThenIsBool(string key){
            this.key = key;
        }
        public string Check(IQueryCollection requestParams){
             if(requestParams.ContainsKey(key)){
                if(Boolean.TryParse(requestParams.ContainsKey(key).ToString(), out bool outBool)){
                    return null;
                } else{
                    return $"query key {key} isn't valid";
                }
            }
            else{
                return null;
            }
        }
    }
}