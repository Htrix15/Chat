using Microsoft.AspNetCore.Http;
using ChatProject.ServicesClasses;
using ChatProject.Interfaces;
using System;
using System.Threading.Tasks;

namespace ChatProject.Services
{
    public class ValidateRequest
    {
        public virtual async Task<DataShell> ValidateAsync(IQueryCollection requestParams, IValidator validator, Func<IQueryCollection, Task<DataShell>> dbMethod)
        {
            var result = validator.Validate(requestParams);
            if (result.CheckNotError())
            {
                return await dbMethod(requestParams);
            }
            else
            {
                return result;
            }
        }

        public virtual async Task<DataShell> ValidateAsync(IValidator validator, Func<IValidator, Task<DataShell>> dbMethod)
        {
            var result = validator.Validate();
            if (result.CheckNotError())
            {
                return await dbMethod(validator);
            }
            else
            {
                return result;
            }
        }
    }
}