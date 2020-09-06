using ChatProject.Interfaces;
using Microsoft.AspNetCore.Http;

namespace ChatProject.Validators.Rules.QueryParamsCheck
{
    public class ContainsKey: IValidateQueryParamsRules
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