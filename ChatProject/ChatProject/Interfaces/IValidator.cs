using Microsoft.AspNetCore.Http;
using ChatProject.ServicesClasses;
using ChatProject.Models;
namespace ChatProject.Interfaces
{
    public interface IValidator
    {
        DataShell Validate(IQueryCollection requestParams) => new DataShell("invalid type");
        DataShell Validate() => new DataShell("invalid type");
        // DataShell Validate(IHeaderDictionary headers) => new DataShell("invalid type");
        //  DataShell Validate(IQueryCollection requestParams, IFormCollection formData) => new DataShell("invalid type");
    }
}