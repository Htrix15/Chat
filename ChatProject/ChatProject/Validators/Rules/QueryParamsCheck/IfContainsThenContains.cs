using ChatProject.Interfaces;
using Microsoft.AspNetCore.Http;

namespace ChatProject.Validators.Rules.QueryParamsCheck
{
    public class IfContainsThenContains: IValidateQueryParamsRules
    {
        private string key1;
        private string key2;
        public IfContainsThenContains(string key1, string key2){
            this.key1 = key1;
            this.key2 = key2;
        }
        public string Check(IQueryCollection requestParams){
            if(requestParams.ContainsKey(key1)){
                if(requestParams.ContainsKey(key2)){
                    return null;
                } else{
                    return $"query key {key2} not found";
                }
            }
            else{
                return null;
            }
        }
    }
}