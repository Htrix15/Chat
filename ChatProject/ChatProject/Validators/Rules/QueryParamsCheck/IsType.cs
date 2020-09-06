using ChatProject.Interfaces;
using Microsoft.AspNetCore.Http;

namespace ChatProject.Validators.Rules.QueryParamsCheck
{
    public class IsType: IValidateQueryParamsRules
    {
        private string key;
        private IValidateStringRules _typeChecker;
        public IsType(string key, IValidateStringRules typeChecker){
             this.key = key;
            _typeChecker = typeChecker;
        }
        public string Check(IQueryCollection requestParams){
            string value = requestParams[key].ToString();
            return _typeChecker.Check(value);
        }        
    }
}