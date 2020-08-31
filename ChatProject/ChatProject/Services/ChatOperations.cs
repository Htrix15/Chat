using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using ChatProject.Interfaces;
using ChatProject.Models;
using ChatProject.ServicesClasses;
using System.Linq;

namespace ChatProject.Services
{
    public class ChatOperations
    {
        private readonly IDb _db;
        public ChatOperations(ChatContext db){
            _db = db;
        }
        public virtual async Task<DataShell> CheckGroupAsync(IQueryCollection requestParams)
        {
            var result = new DataShell();
            var groupName = requestParams["groupName"].ToString();
            result.data = (await _db.SelectAsync<ChatGroup, ChatGroup>(
                predicate: chatGroup => chatGroup.Name == groupName, 
                selector: chatGroup => new ChatGroup(){Id = chatGroup.Id, Name= chatGroup.Name, Private = chatGroup.Private },
                take: 1)).FirstOrDefault();
            
            if(result.data==null){
                result.AddError("Chat group not found");
                return result;
            }
        
            return result;
        }

        public virtual async Task<DataShell> CheckPasswordAsync(IValidator chatGroup)
        {  
            var result = new DataShell();
            var _chatGroup = chatGroup as ChatGroup;

            var foundChatGroup = (await _db.SelectAsync<ChatGroup, ChatGroup>(
                predicate: _ => _.Id == _chatGroup.Id && _.Password == _chatGroup.Password, 
                take: 1)).FirstOrDefault();
            
            if(foundChatGroup==null){
                result.AddError("Incorrect password");
                return result;
            }
    
            return result;   
        }
        public virtual async Task<DataShell> SearchChatsAsync(IQueryCollection requestParams){
            var result = new DataShell();
            var searchGroupName = requestParams["groupName"].ToString();

            result.datas = await _db.SelectAsync<ChatGroup, ChatGroup>(
                predicate: _ => _.Name.Contains(searchGroupName),
                selector: _ => new ChatGroup(){Id = _.Id, Name= _.Name, Private = _.Private }
            );
            if(result.datas == null || result.datas.Count()==0){
                result.AddError("groups not found");
            }
            return result;
        }

        public virtual async Task<DataShell> IncrementUserCount(string id){
            int chatId = Convert.ToInt32(id);
            var thisGroup = (await _db.SelectAsync<ChatGroup, ChatGroup>(
                predicate: _ => _.Id == chatId,
                take: 1)).FirstOrDefault();
            if(thisGroup!=null){
                thisGroup.UserCount++;
                await _db.UpdateAsync(thisGroup);
            }
            return new DataShell();
        }
        public virtual async Task<DataShell> DecrementUserCount(string id){
            int chatId = Convert.ToInt32(id);
            var thisGroup = (await _db.SelectAsync<ChatGroup, ChatGroup>(
                predicate: _ => _.Id == chatId,
                take: 1)).FirstOrDefault();
            if(thisGroup!=null){
                if(thisGroup.UserCount>1){
                    thisGroup.UserCount--;
                    await _db.UpdateAsync(thisGroup);
                } else{
                    await _db.DeleteAsync(thisGroup);
                }
            }
            return new DataShell();
        }
        public virtual async Task<DataShell> AddChatGroupAsync(IValidator chatGroup)
        {  
            var result = new DataShell();
            var _chatGroup =  chatGroup as ChatGroup;
            var newChatGroup = new ChatGroup(){
                Name = _chatGroup.Name,
                Private = _chatGroup.Private,
                Password = _chatGroup.Password
            };
            
            var foundChatGroup = (await _db.SelectAsync<ChatGroup, ChatGroup>(
                predicate: _ => _.Name == _chatGroup.Name , 
                take: 1)).FirstOrDefault();
            if(foundChatGroup!=null){
                result.AddError("Chat name is't unique");
                return result;
            }

            result = await _db.InsertAsync<ChatGroup>(newChatGroup);
            if(result.CheckNotError()){
                newChatGroup.Password = null;
                result.data = newChatGroup;
            }

            return result;   
        }
    }
}