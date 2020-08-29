using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using ChatProject.Models;
using ChatProject.Interfaces;
using ChatProject.Services;
using ChatProject.RequestValidators;
using ChatProject.RequestValidators.Rules;
using Newtonsoft.Json;

namespace ChatProject.Controllers
{
    [ApiController]
    [Route("api")]
    public class ChatController: ControllerBase
    {

        private readonly ValidateRequest _validateRequest;
        private readonly ChatOperations _chatOperations;

        public ChatController (ValidateRequest validateRequest, ChatOperations chatOperations){
            _validateRequest = validateRequest;
            _chatOperations = chatOperations;
        } 

        [HttpGet("check-group-and-nick")]
        public async Task<IActionResult> CheckGroupAndNickAsync()
        {
            var result = await _validateRequest
                .ValidateAsync(
                    Request.Query, 
                    new MyValidator(
                        new ContainsKey("groupName"), 
                        new RegexIsMatch(@"^[а-яА-ЯёЁa-zA-Z0-9 \-+=_\?\!\(\)\<\>]{1,30}$", "groupName"),
                        new ContainsKey("nick"), 
                        new RegexIsMatch(@"^[a-zA-Z0-9 \-+=_\?\!\(\)\<\>]{1,30}$", "nick")
                        ), 
                    _chatOperations.CheckGroupAsync);
            if(result.CheckNotError()){
                return Ok(JsonConvert.SerializeObject(result));
            }
            return BadRequest(result);
        }

        [HttpPost("check-password")]
        public async Task<IActionResult> CheckPasswordAsync(ChatGroup chatGroup){
            var result = await _validateRequest
                .ValidateAsync(
                    chatGroup,
                    _chatOperations.CheckPasswordAsync);
            if(result.CheckNotError()){
                return Ok(JsonConvert.SerializeObject(result));
            }
            return BadRequest(result);

        }
    }
}