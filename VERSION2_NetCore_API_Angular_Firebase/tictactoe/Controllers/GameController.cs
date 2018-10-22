using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
namespace tictactoe.Controllers
{
    public class GameBoard
    {
        public string C1 { get; set; }
        public string C2 { get; set; }
        public string C3 { get; set; }
        public string C4 { get; set; }
        public string C5 { get; set; }
        public string C6 { get; set; }
        public string C7 { get; set; }
        public string C8 { get; set; }
        public string C9 { get; set; }
    }

    public class ATurn
    {
        public string GameId { get; set; }
        public string Turn { get; set; }
        public string Cell { get; set; }
    }

    [Route("api/[controller]")]
    public class GameController : Controller
    {
        [HttpGet("New")]
        public string NewGame()
        {
            var newBoard = new Dictionary<string, string>()
            {
                {"C1", ""},
                {"C2", ""},
                {"C3", ""},
                {"C4", ""},
                {"C5", ""},
                {"C6", ""},
                {"C7", ""},
                {"C8", ""},
                {"C9", ""},
            };

            var db = FirestoreDb.Create("tictactoe-da18c");
            var newGameTask = db.Collection("GameBoard").AddAsync(newBoard);

            newGameTask.Wait();
            return newGameTask.Result.Id;
        }

        [HttpPost("Play")]
        public Timestamp Play([FromBody]ATurn aTurn)
        {
            var db = FirestoreDb.Create("tictactoe-da18c");
            var docRef = db.Collection("GameBoard").Document(aTurn.GameId);

            var updateTask = docRef.UpdateAsync(aTurn.Cell, aTurn.Turn);

            updateTask.Wait();
            return updateTask.Result.UpdateTime;
        }

    }
}
