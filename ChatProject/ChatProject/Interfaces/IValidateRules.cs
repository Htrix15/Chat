using ChatProject.Interfaces;
using ChatProject.ServicesClasses;
using Microsoft.AspNetCore.Http;
using System.Text.RegularExpressions;

namespace ChatProject.Interfaces
{
    public interface IValidateRules
    {
       string Check(IQueryCollection requestParams)=>"requestParams is invalid";
       string Check(string requestParams)=>"string is invalid";
    }
}