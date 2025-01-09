import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Calendar, CreditCard, FileText, MessageSquare } from 'lucide-react'

const Dashboard = () => {
  return (
    
    <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Upcoming Appointments
          </CardTitle>
          <Calendar className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">3</div>
          <p className="text-xs text-gray-500">Next: Tomorrow 10:00 AM</p>
        </CardContent>
      </Card>
            
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Pending Reports
          </CardTitle>
          <FileText className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">2</div>
          <p className="text-xs text-gray-500">Lab results awaiting</p>
        </CardContent>
      </Card>
            
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Recent Payments
          </CardTitle>
          <CreditCard className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">$150</div>
          <p className="text-xs text-gray-500">Last payment: 2 days ago</p>
        </CardContent>
      </Card>
            
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Feedback Rating
          </CardTitle>
          <MessageSquare className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">4.8</div>
          <p className="text-xs text-gray-500">Based on 12 consultations</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard
