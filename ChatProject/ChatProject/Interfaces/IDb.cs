using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq.Expressions;
using ChatProject.ServicesClasses;
using ChatProject.Models;

namespace ChatProject.Interfaces
{
    public interface IDb
    {
        Task<IEnumerable<TResult>> SelectAsync<TEntity, TResult, TKey>(
            Expression<Func<TEntity, TResult>> selector = null, 
            int skip = -1, 
            int take = -1,
            Expression<Func<TResult, TKey>> order = null,
            Expression<Func<TResult, TKey>> orderByDescending = null,
            params Expression<Func<TEntity, bool>>[] predicates
            ) where TEntity : class where TResult : class;
        Task<DataShell> UpdateAsync<TEntity>(TEntity data) where TEntity : class;
        Task<DataShell> DeleteAsync<TEntity>(TEntity data) where TEntity : class;
        Task<DataShell> InsertAsync<TEntity>(TEntity data) where TEntity : class;
        public bool CreateDb();
    }
}
