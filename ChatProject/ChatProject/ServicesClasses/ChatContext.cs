using ChatProject.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Expressions;
using ChatProject.Models;
using ChatProject.Services;

namespace ChatProject.ServicesClasses
{
    public class ChatContext : DbContext, IDb
    {
        private readonly DbColumnsInitializer _dbColumnsInitializer;
        public DbSet<ChatGroup> ChatGroups { get; set; }
        public ChatContext(DbContextOptions<ChatContext> options, DbColumnsInitializer dbColumnsInitializer) : base(options)
        {
            _dbColumnsInitializer = dbColumnsInitializer;
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            _dbColumnsInitializer.DefaultValuesInitializ(new ChatGroup(), modelBuilder);
        }

        public bool CreateDb()
        {
            try
            {
                Database.EnsureCreated();
                return true;
            }
            catch
            {
                return false;
            }
        }

        private async Task<DataShell> DataChangeAsync<TEntity>(TEntity usrData, EntityState entityState = EntityState.Modified) where TEntity : class
        {
            DataShell result = new DataShell();
            try
            {
                Entry<TEntity>(usrData).State = entityState;
                await SaveChangesAsync();
            }
            catch
            {
                result.AddError("Fail set data of DB");
            }
            return result;
        }

        public virtual Task<DataShell> UpdateAsync<TEntity>(TEntity data) where TEntity : class
        {
            return DataChangeAsync<TEntity>(data, EntityState.Modified);
        }

        public virtual Task<DataShell> DeleteAsync<TEntity>(TEntity data) where TEntity : class
        {
            return DataChangeAsync<TEntity>(data, EntityState.Deleted);
        }

        public virtual Task<DataShell> InsertAsync<TEntity>(TEntity data) where TEntity : class
        {
            return DataChangeAsync<TEntity>(data, EntityState.Added);
        }

        public async virtual Task<IEnumerable<TResult>> SelectAsync<TEntity, TResult, TKey, TKey2>(
            Expression<Func<TEntity, bool>> predicate = null, 
            Expression<Func<TEntity, TResult>> selector = null, 
            int skip = -1, 
            int take = -1,
            Expression<Func<TResult, TKey>> order = null,
            Expression<Func<TResult, TKey>> orderByDescending = null,
            Expression<Func<TResult, TKey2>> thenBy = null,
            Expression<Func<TResult, TKey2>> thenByDescending = null)
            where TEntity : class
            where TResult : class
        {

            if (selector != null)
            {
                IQueryable<TResult> query;
                if (predicate != null)
                {
                    query = Set<TEntity>().Where(predicate).Select(selector);        
                }
                else
                {
                    query = Set<TEntity>().Select(selector);
                }

                return await OrderAsync<TResult, TKey, TKey2>(query, skip, take, order, orderByDescending, thenBy, thenByDescending);
            }
            else
            {
                IQueryable<TEntity> query;
                if (predicate != null)
                {
                    query = Set<TEntity>().Where(predicate);
                }
                else
                {
                    query = Set<TEntity>();
                }
                return await OrderAsync<TResult, TKey, TKey2>((IQueryable<TResult>)query, skip, take, order, orderByDescending, thenBy, thenByDescending);
            }
        }

        private async Task<IEnumerable<TResult>> OrderAsync<TResult,TKey,TKey2>(
            IQueryable<TResult> query, 
            int skip = -1, 
            int take = -1,
            Expression<Func<TResult, TKey>> order = null,
            Expression<Func<TResult, TKey>> orderByDescending = null,
            Expression<Func<TResult, TKey2>> thenBy = null,
            Expression<Func<TResult, TKey2>> thenByDescending = null){

            if(order != null){
                if(thenBy != null){
                    query = query.OrderBy(order).ThenBy(thenBy);
                } else if(thenByDescending != null){
                    query = query.OrderBy(order).ThenByDescending(thenByDescending);
                } else {
                    query = query.OrderBy(order);
                }
            } else {
                if(orderByDescending != null){
                    if(thenBy != null){
                        query = query.OrderByDescending(orderByDescending).ThenBy(thenBy);
                    } else if(thenByDescending != null){
                        query = query.OrderByDescending(orderByDescending).ThenByDescending(thenByDescending);
                    } else {
                        query = query.OrderByDescending(orderByDescending);
                    }
                }
            }
            return await SkipTakeAsync<TResult>(query, skip, take);
        }

        private async Task<IEnumerable<TResult>> SkipTakeAsync<TResult>(IQueryable<TResult> query, int skip = -1, int take = -1)
        {
            if (skip != -1)
            {
                query = query.Skip(skip);
            }
            if (take != -1)
            {
                query = query.Take(take);
            }
            return await query.ToListAsync();
        }
    }
}
