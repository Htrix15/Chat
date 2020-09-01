using ChatProject.Interfaces;
using ChatProject.ServicesClasses;
using Microsoft.AspNetCore.Http;
using System.Text.RegularExpressions;

namespace ChatProject.Validators.Rules.QueryParamsCheck
{
    public class RegexIsMatch: IValidateQueryParamsRules
    {
        private string pattern;
        private string key;
        public RegexIsMatch(string pattern, string key){
            this.pattern = pattern;
            this.key = key;
        }
        public string Check(IQueryCollection requestParams)
        {
            var regFormat = new Regex($@"{pattern}", RegexOptions.Compiled | RegexOptions.Singleline);
            if(regFormat.IsMatch(requestParams[key].ToString())){
                return null;
            }
            else return $"{key} there is invalid format";
        }
    }
}