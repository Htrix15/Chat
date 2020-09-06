using System.Collections.Generic;
using ChatProject.Interfaces;

namespace ChatProject.Models
{
    public class DataShell
    {
        public IEnumerable<IData> datas {get; set;}
        public IData data {get; set;}
        public List<string> errors {get; set;}
        public string result {get; set;}

        public DataShell() { }
        public DataShell(string error)
        {
            errors = new List<string>();
            errors.Add(error);
        }
        public void AddError(string error){
            if(errors == null){
                errors = new List<string>();
            }
            errors.Add(error);
        }

        public void SetStringResult(string result){
            this.result = result;
        }

        public bool CheckNotError(){
            if(errors != null) {
                return false;
            }
            return true;
        }

    }
}
