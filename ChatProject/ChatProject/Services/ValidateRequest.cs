using Microsoft.AspNetCore.Http;
using ChatProject.Interfaces;
using System;
using System.Threading.Tasks;
using ChatProject.Models;
namespace ChatProject.Services
{
    public class ValidateRequest
    {
        public async Task<DataShell> ValidateAsync(IQueryCollection requestParams, IValidator validator, Func<IQueryCollection, Task<DataShell>> dbMethod)
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
        public  DataShell Validate(IQueryCollection requestParams,IValidator validator)
        {
            var result = validator.Validate(requestParams);
            return result;
        }

        public async Task<DataShell> ValidateAsync(string value, IValidator validator, Func<string, Task<DataShell>> dbMethod){
            var result = validator.Validate(value);
            if (result.CheckNotError())
            {
                return await dbMethod(value);
            }
            else
            {
                return result;
            }
        }

        public async Task<DataShell> ValidateAsync(IValidator validator, Func<IValidator, Task<DataShell>> dbMethod)
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