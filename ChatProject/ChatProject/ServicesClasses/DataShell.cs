using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System;
using ChatProject.Interfaces;

namespace ChatProject.ServicesClasses
{
    public class DataShell
    {
        public IEnumerable<IData> datas;
        public IData data;
        public string error;
        public string stringData;
        public DateTime dataTime;

        public IFormFile File { get; set; }
        public List<IFormFile> Files { get; set; }
        public DataShell() { }
        public DataShell(string error)
        {
            this.error = error;
        }
    }
}
