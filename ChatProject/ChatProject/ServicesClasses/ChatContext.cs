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

        public  Task<DataShell> UpdateAsync<TEntity>(TEntity data) where TEntity : class
        {
            return DataChangeAsync<TEntity>(data, EntityState.Modified);
        }

        public  Task<DataShell> DeleteAsync<TEntity>(TEntity data) where TEntity : class
        {
            return DataChangeAsync<TEntity>(data, EntityState.Deleted);
        }

        public  Task<DataShell> InsertAsync<TEntity>(TEntity data) where TEntity : class
        {
            return DataChangeAsync<TEntity>(data, EntityState.Added);
        }

        public async  Task<IEnumerable<TResult>> SelectAsync<TEntity, TResult, TKey>(
            Expression<Func<TEntity, TResult>> selector = null, 
            int skip = -1, 
            int take = -1,
            Expression<Func<TResult, TKey>> order = null,
            Expression<Func<TResult, TKey>> orderByDescending = null,
            params Expression<Func<TEntity, bool>>[] predicates
            )
            where TEntity : class
            where TResult : class
        {
            try{
                if (selector != null)
                {
                    IQueryable<TResult> query;
                    if (predicates != null && predicates.Length>0)
                    {
                        IQueryable<TEntity> queries = Set<TEntity>();
                        foreach(var predicate in predicates){
                            if(predicate != null){
                                queries = queries.Where(predicate);
                            }
                        }
                        query = queries.Select(selector);        
                    }
                    else
                    {
                        query = Set<TEntity>().Select(selector);
                    }

                    return await OrderAsync<TResult, TKey>(query, skip, take, order, orderByDescending);
                }
                else
                {
                    IQueryable<TEntity> query = Set<TEntity>();
                    if (predicates != null && predicates.Length>0)
                    {
                        foreach(var predicate in predicates){
                            if(predicate != null){
                                query = query.Where(predicate);
                            }
                        }
                    }
                    return await OrderAsync<TResult, TKey>((IQueryable<TResult>)query, skip, take, order, orderByDescending);
                }
            } catch {
                return null;
            }
        }

        private async Task<IEnumerable<TResult>> OrderAsync<TResult,TKey>(
            IQueryable<TResult> query, 
            int skip = -1, 
            int take = -1,
            Expression<Func<TResult, TKey>> order = null,
            Expression<Func<TResult, TKey>> orderByDescending = null){
            try{    
                if(order != null){
                    query = query.OrderBy(order);
                } else if(orderByDescending != null){
                    query = query.OrderByDescending(orderByDescending);
                }
                return await SkipTakeAsync<TResult>(query, skip, take);
            } catch {
                return null;
            }
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
