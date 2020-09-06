using Microsoft.AspNetCore.Http;
using ChatProject.Models;
namespace ChatProject.Interfaces
{
    public interface IValidator
    {
        DataShell Validate(IQueryCollection requestParams) => new DataShell("invalid type");
        DataShell Validate(string requestParams) => new DataShell("invalid type");
        DataShell Validate() => new DataShell("invalid type");
    }
}