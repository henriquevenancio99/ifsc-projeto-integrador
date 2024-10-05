namespace SalonScheduling.CrossCutting.Constants
{
    public static class Roles
    {
        public const string Admin = "admin";
        public const string Employee = "employee";
        public const string Client = "client";

        public static string[] GetAll() => [Admin, Employee, Client];
    }
}
