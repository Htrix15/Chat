using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ChatProject.Models;
using ChatProject.Services;
using ChatProject.Validators;
using ChatProject.Validators.Rules.QueryParamsCheck;
using ChatProject.Validators.Rules.StringTypeCheck;
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
                    new QueryParamsValidator(
                        new ContainsKey("groupName"), 
                        new RegexIsMatch(@"^[а-яА-ЯёЁa-zA-Z0-9 \-+=_\?\!\(\)\<\>]{3,30}$", "groupName"),
                        new ContainsKey("nick"), 
                        new RegexIsMatch(@"^[a-zA-Z0-9 \-+=_\?\!\(\)\<\>]{3,30}$", "nick")
                        ), 
                    _chatOperations.CheckGroupAsync);
            if(result.CheckNotError()){
                return Ok(JsonConvert.SerializeObject(result));
            }
            return BadRequest(result);
        }

        [HttpGet("check-nick")]
        public IActionResult CheckNickAsync()
        {
            var result = _validateRequest
                .Validate(
                    Request.Query, 
                    new QueryParamsValidator(
                        new ContainsKey("nick"), 
                        new RegexIsMatch(@"^[a-zA-Z0-9 \-+=_\?\!\(\)\<\>]{3,30}$", "nick")
                        )
                    );
            if(result.CheckNotError()){
                return Ok();
            }
            return BadRequest(result);
        }

        [HttpGet("search-chats")]
        public async Task<IActionResult> SearchChats()
        {
            var result = await _validateRequest
                .ValidateAsync(
                    Request.Query, 
                    new QueryParamsValidator(
                        new ContainsKey("groupName"), 
                        new RegexIsMatch(@"^[а-яА-ЯёЁa-zA-Z0-9 \-+=_\?\!\(\)\<\>]{3,30}$", "groupName"),
                        new ContainsKey("onlyPublic"), 
                        new IsType("onlyPublic", new StringIsBool()),
                        new IfContainsThenOneOf("order", "name", "date", "user-count", "activity"),
                        new IfContainsThenContains("order","orderAsc"),
                        new IfContainsThenIsType("orderAsc", new StringIsBool()),
                        new ContainsKey("skip"), 
                        new IsType("skip", new StringIsInt()), 
                        new ContainsKey("take"),
                        new IsType("take", new StringIsInt())  
                    ), 
                    _chatOperations.SearchChatsAsync);
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

        [HttpPost("create-chat")]
        public async Task<IActionResult> CreateChatAsync(ChatGroup chatGroup){
            var result = await _validateRequest
                .ValidateAsync(
                    chatGroup,
                    _chatOperations.AddChatGroupAsync);
            if(result.CheckNotError()){
                return Ok(JsonConvert.SerializeObject(result));
            }
            return BadRequest(result);
        }
    }
}