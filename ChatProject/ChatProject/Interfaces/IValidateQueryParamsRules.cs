using Microsoft.AspNetCore.Http;

namespace ChatProject.Interfaces
{
    public interface IValidateQueryParamsRules
    {
       string Check(IQueryCollection requestParams);
    }
}