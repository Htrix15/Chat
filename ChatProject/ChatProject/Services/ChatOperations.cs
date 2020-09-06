using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using ChatProject.Interfaces;
using ChatProject.Models;
using ChatProject.ServicesClasses;
using System.Linq;
using System.Linq.Expressions;

namespace ChatProject.Services
{
    public class ChatOperations
    {
        private readonly IDb _db;
        private readonly SupportingMethods _supportingMethods;
        public ChatOperations(ChatContext db, SupportingMethods supportingMethods){
            _db = db;
            _supportingMethods = supportingMethods;
        }

        public async Task<DataShell> CheckGroupAsync(IQueryCollection requestParams)
        {
            var result = new DataShell();
            var groupName = requestParams["groupName"].ToString();
            result.data = (await _db.SelectAsync<ChatGroup, ChatGroup, int>(
                predicates: chatGroup => chatGroup.Name == groupName, 
                selector: chatGroup => new ChatGroup(){Id = chatGroup.Id, Name= chatGroup.Name, Private = chatGroup.Private },
                take: 1)).FirstOrDefault();
            
            if(result.data==null){
                result.AddError("Chat group not found");
                return result;
            }
        
            return result;
        }

        public async Task<DataShell> CheckPasswordAsync(IValidator chatGroup)
        {  
            var result = new DataShell();
            var _chatGroup = chatGroup as ChatGroup;
            var password = _supportingMethods.GetHashString(_chatGroup.Password);

            var foundChatGroup = (await _db.SelectAsync<ChatGroup, ChatGroup, int>(
                predicates: _ => _.Id == _chatGroup.Id && _.Password == password, 
                take: 1)).FirstOrDefault();
            
            if(foundChatGroup==null){
                result.AddError("Incorrect password");
                return result;
            }
    
            return result;   
        }
        public async Task<DataShell> SearchChatsAsync(IQueryCollection requestParams){
            var result = new DataShell();
            var searchGroupName = requestParams["groupName"].ToString();
            var onlyPublic = Convert.ToBoolean(requestParams["onlyPublic"]);
            int skip = Convert.ToInt32(requestParams["skip"]);
            int take = Convert.ToInt32(requestParams["take"]);

            Expression<Func<ChatGroup, Object>> order = null;
            Expression<Func<ChatGroup, Object>> orderByDescending = null;
            Expression<Func<ChatGroup, bool>> checkPrivate = null;

            if(requestParams.ContainsKey("order")){
                if( Convert.ToBoolean(requestParams["orderAsc"])){
                    switch(requestParams["order"].ToString()){
                        case("name"):{
                            order = _ => _.Name;
                            break;}
                        case("user-count"):{
                            order = _ => _.UserCount;
                            break;}
                        case("date"):{
                            order = _ => _.DateCreated;
                            break;}
                        case("activity"):{
                            order = _ =>  _.MessageCount/(_.UserCount==0?1:_.UserCount);
                            break;}
                    }
                } 
                else { 
                    switch(requestParams["order"].ToString()){
                        case("name"):{
                            orderByDescending = _ => _.Name;
                            break;}
                        case("user-count"):{
                            orderByDescending = _ => _.UserCount;
                            break;}
                        case("date"):{
                            orderByDescending = _ => _.DateCreated;
                            break;}
                        case("activity"):{
                            orderByDescending = _ =>  _.MessageCount/(_.UserCount==0?1:_.UserCount);
                            break;}
                    }
                }
            }

            if(onlyPublic){
                checkPrivate = _ => _.Private==false;
            }

            result.datas = await _db.SelectAsync<ChatGroup, ChatGroup, Object>(
                _ => new ChatGroup(){
                    Id = _.Id, 
                    Name= _.Name, 
                    Private = _.Private, 
                    UserCount = _.UserCount,
                    MessageCount = _.MessageCount,
                    DateCreated = _.DateCreated}, 
                skip,
                take,
                order, 
                orderByDescending,
                _ => _.Name.Contains(searchGroupName),
                checkPrivate
            );

            if(result.datas == null || result.datas.Count()==0){
                result.AddError("groups not found");
            }
            return result;
        }

        public async Task<DataShell> IncrementUserCount(string id){
            int chatId = Convert.ToInt32(id);
            var thisGroup = (await _db.SelectAsync<ChatGroup, ChatGroup, int>(
                predicates: _ => _.Id == chatId,
                take: 1)).FirstOrDefault();
            if(thisGroup!=null){
                thisGroup.UserCount++;
                await _db.UpdateAsync(thisGroup);
            }
            return new DataShell();
        }
        public async Task<DataShell> DecrementUserCount(string id){
            int chatId = Convert.ToInt32(id);
            var thisGroup = (await _db.SelectAsync<ChatGroup, ChatGroup, int>(
                predicates: _ => _.Id == chatId,
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

        public async Task<DataShell> IncrementMessageCount(string id){
            int chatId = Convert.ToInt32(id);
            var thisGroup = (await _db.SelectAsync<ChatGroup, ChatGroup, int>(
                predicates: _ => _.Id == chatId,
                take: 1)).FirstOrDefault();
            if(thisGroup!=null){
                thisGroup.MessageCount++;
                await _db.UpdateAsync(thisGroup);
            }
            return new DataShell();
        }

        public async Task<DataShell> AddChatGroupAsync(IValidator chatGroup)
        {  
            var result = new DataShell();
            var _chatGroup =  chatGroup as ChatGroup;
            var password = _chatGroup.Password!=null? _supportingMethods.GetHashString(_chatGroup.Password):null;
            var newChatGroup = new ChatGroup(){
                Name = _chatGroup.Name,
                Private = _chatGroup.Private,
                Password = password
            };
            
            var foundChatGroup = (await _db.SelectAsync<ChatGroup, ChatGroup, int>(
                predicates: _ => _.Name == _chatGroup.Name , 
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