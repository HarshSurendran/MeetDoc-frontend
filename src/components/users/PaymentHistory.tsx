import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { BadgeInfo, Calendar, User } from 'lucide-react';
import errorHandler from '@/utils/errorHandler';
import { getPaymentHistory } from '@/services/user/user';
import { Badge } from '../ui/badge';
import { format, parseISO, set } from 'date-fns';
import { IPaymentHistory } from '@/types';
import Pagination from '../Pagination';


const PaymentHistory = () => {
  const [payments, setPayments] = useState<IPaymentHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('10'); 
  const [totalDocs, setTotalDocs] = useState(0);

  useEffect(() => {
    fetchPayments(currentPage, Number(pageSize));
  }, [currentPage, pageSize]);

  const fetchPayments = async (page: number, limit: number) => {
    try {
      const response = await getPaymentHistory(page, limit);
      if (response.status) {
          setTotalDocs(response.data.totalDocs);
          const sortedPayment = response.data.payments.sort((a: IPaymentHistory, b: IPaymentHistory) => new Date(b.bookingTime).getTime() - new Date(a.bookingTime).getTime());
          setPayments(sortedPayment);
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return (
   <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-800">
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {payments.map((payment) => (
                <Card 
                  key={payment._id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                   
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold">
                            {`Payment ${payment.paymentStatus}, for Rs. ${payment.amount} `}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{ format(parseISO(payment.bookingTime), "dd MMM yyyy hh:mm a")}</span>
                          <User className="h-4 w-4 text-gray-500 ml-2" />
                            <span className="text-sm text-gray-600">{`For: ${payment.appointmentForName}`}</span>
                            <BadgeInfo className='h-4 w-4 bg-green-100 text-gray-500' />
                            <span className="text-sm text-gray-600">{`PaymentId: ${payment.paymentId}`} </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className='bg-green-100 text-green-800'>
                          {payment.paymentStatus}
                        </Badge>
                        
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <Pagination
      currentPage={currentPage}
      pageSize={Number(pageSize)}
      totalItems={totalDocs}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
      </Card>
    </div>
  )
}

export default PaymentHistory;
