var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.MyWebAPI>("mywebapi");

builder.Build().Run();
