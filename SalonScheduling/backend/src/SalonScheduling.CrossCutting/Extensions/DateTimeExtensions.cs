using System.Globalization;

namespace SalonScheduling.CrossCutting.Extensions
{
    public static class DateTimeExtensions
    {
        public static TimeZoneInfo BrazilTimeZone => 
            TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");

        public static DateTimeOffset ToDateTimeOffsetUtc(this string dateTimeString) =>
            DateTimeOffset.Parse(dateTimeString).ToUniversalTime();

        public static string FromUtcToString(this DateTimeOffset dateTime)
        {
            var brasilDateTime = TimeZoneInfo.ConvertTime(dateTime, BrazilTimeZone);
            return brasilDateTime.ToString("s");
        }
    }
}
