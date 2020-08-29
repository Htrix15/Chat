using ChatProject.Interfaces;
using ChatProject.ServicesClasses;
using Microsoft.AspNetCore.Http;
using System.Text.RegularExpressions;

namespace ChatProject.RequestValidators.Rules
{
    public class ContainsKey: IValidateRules
    {
        private string key;
        public ContainsKey(string key){
            this.key = key;
        }
        public string Check(IQueryCollection requestParams){
            if(requestParams.ContainsKey(key)){
                return null;
            }
            else return $"query key {key} not found";
        }
    }
}