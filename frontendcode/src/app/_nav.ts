export const navItems = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Cash Office'
  },
  {
    name: 'CashOfficeMaster',
    url: '/cashofficemaster',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Setup-Cashier',
        url: '/cashofficemaster/setupcashier',
        icon: 'icon-star'
      },
      {
        name: 'Setup-PaymentMethod',
        url: '/cashofficemaster/setuppaymentmethod',
        icon: 'icon-star'
      },
      {
        name: 'Setup-Applications',
        url: '/cashofficemaster/setupapplications',
        icon: 'icon-star'
      },
      {
        name: 'Setup-CashOffice',
        url: '/cashofficemaster/setupcashoffice',
        icon: 'icon-star'
      },
      {
        name: 'Assign-Cashier',
        url: '/cashofficemaster/assigncashier',
        icon: 'icon-star'
      }      
    ]
  },
  {
    name: 'CashOfficeTransactions',
    url: '/cashofficetransaction',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'cashofficeactivity',
        url: '/cashofficetransaction/cashofficeactivity',
        icon: 'icon-star'
      },
      {
        name: 'cashtillactivity',
        url: '/cashofficetransaction/cashtillactivity',
        icon: 'icon-star'
      },
      {
        name: 'paymentreceipt',
        url: '/cashofficetransaction/paymentreceipt',
        icon: 'icon-star'
      },
      {
        name: 'Query-Reciept',
        url: '/cashofficetransaction/QueryReciept',
        icon: 'icon-star'
      },
      {
        name: 'CancelReciept',
        url: '/cashofficetransaction/CancelReciept',
        icon: 'icon-star'
      },
      
    {
      name: 'Approvecancellation',
      url: '/cashofficetransaction/Approvecancellation',
      icon: 'icon-star'
    },
    {
      name: 'PrintSlip',
      url: '/cashofficetransaction/PrintSlip',
      icon: 'icon-star'
    },
   
    {
      name: 'ReceiptPosting',
      url: '/cashofficetransaction/ReceiptPosting',
      icon: 'icon-star'
    },
     
      // {
      //   name: 'secureloanenquire',
      //   url: '/cashofficetransaction/secureloanenquire',
      //   icon: 'icon-star'
      // }             
    ]
  },
  {
    name: 'CashOfficeReports',
    url: '/cashofficereports',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Cashier-Assignment',
        url: '/cashofficereports/cashier-assignment',
        icon: 'icon-star'
      },
      {
        name: 'Collection-Branch',  //Name of the menu item
        url: '/cashofficereports/collection-branch', //url at url bar
        icon: 'icon-star'
      },
      {
        name: 'Collection-App-Detail',
        url: '/cashofficereports/collection-app-detail',
        icon: 'icon-star'
      },
      {
        name: 'Collection-App-Summary',
        url: '/cashofficereports/collection-app-summary',
        icon: 'icon-star'
      },
      {
        name: 'Receipt-Listing',
        url: '/cashofficereports/receipt-listing',
        icon: 'icon-star'
      },
      {
        name: 'Deposit-Slip',
        url: '/cashofficereports/deposit-slip',
        icon: 'icon-star'
      },
      {
        name: 'Reprint-Receipt',
        url: '/cashofficereports/reprint-receipt',
        icon: 'icon-star'
      }       
    ]
  },
  
  {
    name: 'Pay Point Master',
    url: '/paypointmaster',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Debit File Template Assignment',
        url: '/paypointmaster/debit-file-template-assignment',
        icon: 'icon-star'        
      },
      {
        name: 'File Designer',
        url: '/paypointmaster/filedesigner',
        icon: 'icon-star'
      }      
    ]
  },
  {
    name: 'Pay Point Transaction',
    url: '/paypointtransaction',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Generate DebitFile',
        url: '/paypointtransaction/generate-debitfile',
        icon: 'icon-star'        
      },
      // {
      //   name: 'Split/Merge DebitFile',
      //   url: '/paypointtransaction/split-merge-debitfile',
      //   icon: 'icon-star'
      // },
      // {
      //   name: 'Split/Merge Search',
      //   url: '/paypointtransaction/split-merge-search',
      //   icon: 'icon-star'
      // },
      {
        name: 'Upload CreditFile',
        url: '/paypointtransaction/upload-creditfile',
        icon: 'icon-star'
      }      
    ]
  },
  {
    name: 'Allocations',
    url: '/allocation',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Electronic Allocation',
        url: '/allocation/electronic-allocation',
        icon: 'icon-star'
      },
      {
        name: 'Manual Allocation',
        url: '/allocation/manual-allocation',
        icon: 'icon-star'
      },
      {
        name: 'Direct Debit Processing',
        url: '/allocation/direct-debit-processing',
        icon: 'icon-star'
      },
      {
        name: 'Bank Stop Order Processing',
        url: '/allocation/bank-stop-order-processing',
        icon: 'icon-star'
      },
      {
        name: 'Bank Statement Posting',
        url: '/allocation/bank-statement-posting',
        icon: 'icon-star'
      },
      {
        name: 'Misallocation Correction',
        url: '/allocation/misallocation-correction',
        icon: 'icon-star'
      },
      {
        name: 'PayPoint Misallocation',
        url: '/allocation/paypoint-misallocation',
        icon: 'icon-star'
      },
      {
        name: 'Bank Statement Adjustment Voucher',
        url: '/allocation/bank-statement-adjustment-voucher',
        icon: 'icon-star'
      },
      {
        name: 'Manual Adjustment Voucher',
        url: '/allocation/manual-adjustment-voucher',
        icon: 'icon-star'
      },
      {
        name: 'PayPoint Collection History',
        url: '/allocation/paypoint-collection-history',
        icon: 'icon-star'
      },
      {
        name: 'Partial Misallocation Correction',
        url: '/allocation/partial-misallocation-correction',
        icon: 'icon-star'
      },
    ]
  },
  {
    name: 'PayPoint Reports',
    url: '/paypoint-reports',
    icon: 'icon-bell',
    children: [
      {
        name: 'Overs And Unders',
        url: '/paypoint-reports/oversandunders',
        //icon: 'icon-bell'
      },
  
    {
      name: 'Rejections',
      url: '/paypoint-reports/rejections',
      //icon: 'icon-bell'
    },
    {
      name: 'PayPoint Summary',
      url: '/paypoint-reports/paypoint-summary',
      //icon: 'icon-bell'
    },
    {
      name: 'UnAllocated Cash Reciepts',
      url: '/paypoint-reports/unallocated-cashReciepts',
      //icon: 'icon-bell'
    },
    { 
      name: 'Unmatched Credits',
      url: '/paypoint-reports/unmatchedCredit',
      //icon: 'icon-bell'
    },
    {
      name: 'Reciept Allocation Status',
      url: '/paypoint-reports/reciept-allocation-status',
      //icon: 'icon-bell'
    }
    ,
    {
      name: 'Unspecified Bank',
      url: '/paypoint-reports/unspecified-bank',
    }
    ,
    {
      name: 'Unspecified GSO-ESO',
      url: '/paypoint-reports/unspecified-gsoeso',
    },
    {
      name: 'Bank Statement',
      url: '/paypoint-reports/bank-statement',
    },
    {
      name: 'Manual Adjustment Report',
      url: '/paypoint-reports/manual-adjustment'
    },
    {
      name: 'Bank Statement Allocation',
      url: '/paypoint-reports/statement-allocation'
    }
    
  ]
  },
  {
    name: 'Admin',
    url: '/admin',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'User Management',
        url: '/admin/user-management',
        icon: 'icon-star'
      },
      {
        name: 'Assign role',
        url: '/admin/assign-role',
        icon: 'icon-star'
      },
      {
        name: 'Group Master',
        url: '/admin/group-master',
        icon: 'icon-star'
      },
      {
        name: 'Page Access',
        url: '/admin/page-access',
        icon: 'icon-star'
      },
      {
        name: 'Reset Password',
        url: '/admin/reset-password',
        icon: 'icon-star'
      }      
    ]
  },  

  // {
  //   name: 'Charts',
  //   url: '/charts',
  //   icon: 'icon-pie-chart'
  // },
  // {
  //   name: 'Icons',
  //   url: '/icons',
  //   icon: 'icon-star',
  //   children: [
  //     {
  //       name: 'CoreUI Icons',
  //       url: '/icons/coreui-icons',
  //       icon: 'icon-star',
  //       badge: {
  //         variant: 'success',
  //         text: 'NEW'
  //       }
  //     },
  //     {
  //       name: 'Flags',
  //       url: '/icons/flags',
  //       icon: 'icon-star'
  //     },
  //     {
  //       name: 'Font Awesome',
  //       url: '/icons/font-awesome',
  //       icon: 'icon-star',
  //       badge: {
  //         variant: 'secondary',
  //         text: '4.7'
  //       }
  //     },
  //     {
  //       name: 'Simple Line Icons',
  //       url: '/icons/simple-line-icons',
  //       icon: 'icon-star'
  //     }
  //   ]
  // },
  // {
  //   name: 'Notifications',
  //   url: '/notifications',
  //   icon: 'icon-bell',
  //   children: [
  //     {
  //       name: 'Alerts',
  //       url: '/notifications/alerts',
  //       icon: 'icon-bell'
  //     },
  //     {
  //       name: 'Badges',
  //       url: '/notifications/badges',
  //       icon: 'icon-bell'
  //     },
  //     {
  //       name: 'Modals',
  //       url: '/notifications/modals',
  //       icon: 'icon-bell'
  //     }
  //   ]
  // },
  // {
  //   name: 'Widgets',
  //   url: '/widgets',
  //   icon: 'icon-calculator',
  //   badge: {
  //     variant: 'info',
  //     text: 'NEW'
  //   }
  // },
  // {
  //   divider: true
  // },
  // {
  //   title: true,
  //   name: 'Extras',
  // },
  {
    name: 'Pages',
    url: '/pages',
    icon: 'icon-star',
    children: [
      {
        name: 'Login',
        url: '/login',
        icon: 'icon-star'
      },
      {
        name: 'Register',
        url: '/register',
        icon: 'icon-star'
      },
      {
        name: 'Error 404',
        url: '/404',
        icon: 'icon-star'
      },
      {
        name: 'Error 500',
        url: '/500',
        icon: 'icon-star'
      }
    ]
  }

];
export const apiURL="http://192.168.1.145:8080/CashOffice-Test/api";
export const loginURL="http://192.168.1.145:8080/CashOffice-Test";

