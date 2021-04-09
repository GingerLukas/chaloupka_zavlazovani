typedef int int32;
typedef unsigned int uint32;
typedef long long int64;
typedef unsigned long long uint64;

/*---------STDLIB-C---------*/
#pragma region STDLIB - C

int isalnum(int c);
int isalpha(int c);
int isblank(int c);
int iscntrl(int c);
int isdigit(int c);
int isgraph(int c);
int islower(int c);
int isprint(int c);
int ispunct(int c);
int isspace(int c);
int isupper(int c);
int isxdigit(int c);
int tolower(int c);
int toupper(int c);
int isascii(int c);
int toascii(int c);

float atof(char *str);
int atoi(char *str);
int atol(char *str);
int strtol(char *str, char **endptr, int base);
unsigned int strtoul(char *str, char **endptr, int base);
int abs(int n);
int labs(int n);

int rand(void);

void *malloc(int size);
void *calloc(int num, int size);
void *realloc(void *ptr, int size);
void free(void *ptr);
void *memset(void *ptr, int value, int num);
void *memcpy(void *destination, void *source, int num);
int memcmp(void *ptr1, void *ptr2, int num);

char *strcpy(char *destination, char *source);
char *strncpy(char *destination, char *source, int num);
int strcmp(char *str1, char *str2);
int strncmp(char *str1, char *str2, int num);
char *strcat(char *destination, char *source);
char *strncat(char *destination, char *source, int num);
int strlen(char *str);
char *strchr(char *str, int character);
char *strstr(char *str1, char *str2);

int sprintf(char *str, char *format, ...);
int snprintf(char *str, int n, char *format, ...);
int sscanf(char *s, char *format, ...);

#pragma endregion

/*---------CONSOLE---------*/
#pragma region CONSOLE

int putchar(int character);
int puts(char *str);
int printf(char *format, ...);
void echoclear(void);

#pragma endregion

/*---------SDS_get_set---------*/
#pragma region SDS_get_set

void SDS_set_i32(unsigned int index, signed int value);
signed int SDS_get_i32(unsigned int index);

void SDS_set_i64(unsigned int index, int64 value);
signed int SDS_get_i64(unsigned int index);

void SDS_set_u32(unsigned int index, unsigned int value);
unsigned int SDS_get_u32(unsigned int index);

void SDS_set_u64(unsigned int index, uint64 value);
unsigned int SDS_get_u64(unsigned int index);

void SDS_set_f32(unsigned int index, float value);
float SDS_get_f32(unsigned int index);

void SDS_set_a(unsigned int index, void *ptr, unsigned int len);
void SDS_get_a(unsigned int index, void *ptr, unsigned int maxlen);

#pragma endregion

/*---------FLASH---------*/
#pragma region FLASH

unsigned int DF_read_page(unsigned int pageindex, void *pagedata);
unsigned int DF_write_page(unsigned int pageindex, void *pagedata);
unsigned int DF_erase_page(unsigned int pageindex);

#pragma endregion

/*---------SDS_serial---------*/
#pragma region SDS_serial

void SDS_serial_config(unsigned int busID, unsigned int BaudRateCfg, unsigned int DataSizeCfg, unsigned int StopBitsCfg, unsigned int ParityCfg);
void SDS_serial_writeCH(unsigned int busID, unsigned char writeChar);
void SDS_serial_write(unsigned int busID, char *ptr, unsigned int len);
unsigned int SDS_serial_read(unsigned int busID, char *ptr, unsigned int maxlen);

#pragma endregion

/*---------SDS_TOPB---------*/
#pragma region SDS_TOPB

void SDS_TOPB_keyboard_status(unsigned int *changed, unsigned int *actual, unsigned int *intermediatePresses[6]);

void SDS_TOPB_LCDdraw(unsigned int X0, unsigned int Y0, unsigned int X1, unsigned int Y1, unsigned int DrawTYPE, unsigned int FLAGS);
void SDS_TOPB_LCDtext(unsigned int X0, unsigned int Y0, unsigned int FLAGS, char *ptr, unsigned int len);
void SDS_TOPB_LCDbitmap(unsigned int X0, unsigned int ROW, unsigned int FLAGS, char *ptr, unsigned int len);
void SDS_TOPB_LCDflip(unsigned int FLAGS);

#pragma endregion

/*---------SDS_DALI---------*/
#pragma region SDS_DALI

unsigned int SDS_TOPB_DALI_transmitCommand(unsigned int DALIaddress, unsigned int DALIdata);
unsigned int SDS_TOPB_DALI_getReceivedResponse(unsigned int *ReceivedResponse);

#pragma endregion

/*---------SDS_PWM---------*/
#pragma region SDS_PWM

void SDS_PWM_disableOutput(void);
void SDS_PWM_setDutyAsPercents(unsigned int generatorFrequency, unsigned int Percents);
void SDS_PWM_setDutyAsUSECS(unsigned int USECS);

#pragma endregion

/*---------SDS_MAIN---------*/
#pragma region SDS_MAIN

void SDS_reset_program(unsigned int key);
void SDS_set_wdg(unsigned int newTimeOut);
void SDS_kick_wdg(unsigned int key);

void SDS_heap_stats(unsigned int *currentAllocatedBytes, unsigned int *totalFreeBytes, unsigned int *biggestFreeBlockAvailable);

void SDS_disable_onewire(void);

#pragma endregion

/*---------SDS_UTILS---------*/
#pragma region SDS_UTILS

unsigned int SDS_crypto(unsigned int Algorithm, unsigned int *CounterBlock, void *PayloadData, unsigned int PayloadDataSize);

unsigned int SDS_ToBase64(void *inputBuf, void *outputBuf, unsigned int inputLen, unsigned int FLAGS);
unsigned int SDS_FromBase64(void *inputBuf, void *outputBuf, unsigned int inputLen, unsigned int FLAGS);

#pragma endregion

/*---------HTTP---------*/
#pragma region HTTP

void http_get(unsigned int IP0, unsigned int IP1, unsigned int IP2, unsigned int IP3, unsigned int Port, char *HostName, char *GETtext, void *ReceiveDataBuffer, unsigned int MaximalReceiveDataLength);
unsigned int http_get_status(unsigned int *httpResponseValue, unsigned int *receivedDataSize);

void http_post(unsigned int IP0, unsigned int IP1, unsigned int IP2, unsigned int IP3, unsigned int Port, char *HostName, char *GETtext, void *ReceiveDataBuffer,
               unsigned int MaximalReceiveDataLength, char *POSTtext);

void http_close(void);

#pragma endregion

/*---------SMTP---------*/
#pragma region SMTP

void smtp_send(char *TargetEmailAddress, char *EmailSubject, char *TextContent);
unsigned int smtp_send_status(void);

#pragma endregion

/*---------UDP---------*/
#pragma region UDP

void udp_send(unsigned int IP0, unsigned int IP1, unsigned int IP2, unsigned int IP3, unsigned int Port, void *PayloadData, unsigned int PayloadLength);
unsigned int udp_send_status(void);

#pragma endregion

/*---------DNS---------*/
#pragma region DNS

void dns_resolv(char *domainNameInput);
unsigned int dns_resolv_status(unsigned int *IP0value, unsigned int *IP1value, unsigned int *IP2value, unsigned int *IP3value);

#pragma endregion

/*---------SNMP_TRAP---------*/
#pragma region SNMP_TRAP

void snmp_send_trap(unsigned int IP0, unsigned int IP1, unsigned int IP2, unsigned int IP3, unsigned int PDUspecificType, unsigned int tableIndex);
unsigned int snmp_send_trap_status(void);

#pragma endregion

/*---------PING---------*/
#pragma region PING

void ping_send(unsigned int IP0, unsigned int IP1, unsigned int IP2, unsigned int IP3, unsigned int sendPingSequenceValue);
unsigned int ping_send_status(unsigned int *pingReceivedSequence, unsigned int *pingReceivedRTTmsec);

#pragma endregion

/*---------MQTT---------*/
#pragma region MQTT

void mqtt_connect(unsigned int IP0, unsigned int IP1, unsigned int IP2, unsigned int IP3, unsigned int TCPport, char *ClientID, char *username, char *password, unsigned int KeepAliveSec);
void mqtt_disconnect(void);
void mqtt_publish(char *FullTopicName, char *Value);
void mqtt_subscribe(unsigned int TableIndex, char *FullTopicName);
void mqtt_unsubscribe_index(unsigned int TableIndex);
void mqtt_unsubscribe_name(char *FullTopicName);

#pragma endregion

/*---------TCP---------*/
#pragma region TCP

void modbus_tcp_connect(unsigned int IP0, unsigned int IP1, unsigned int IP2, unsigned int IP3, unsigned int TCPport, unsigned int reserved);
void modbus_tcp_disconnect(void);
void modbus_tcp_read(unsigned int UID, unsigned int Function, unsigned int Item, unsigned int Count);
void modbus_tcp_writesingle(unsigned int UID, unsigned int Function, unsigned int StartItem, int Value);
void modbus_tcp_writemultiple(unsigned int UID, unsigned int Function, unsigned int StartItem, unsigned int Count, int *writeArray);

#pragma endregion

/*---------SD_CARD---------*/
#pragma region SD_CARD

int file_open(unsigned int *p_file_handle, char *file_path, char *open_mode);
int file_close(unsigned int *p_file_handle);
int file_read(unsigned int file_handle, void *buffer, unsigned int bytes_to_read, unsigned int *bytes_read);
int file_write(unsigned int file_handle, void *buffer, unsigned int bytes_to_write, unsigned int *bytes_written);
int file_sync(unsigned int file_handle);
int file_lseek(unsigned int file_handle, uint64 new_position);
uint64 file_tell(unsigned int file_handle);
int file_eof(unsigned int file_handle);
int file_truncate(unsigned int file_handle);
int file_expand(unsigned int file_handle, uint64 new_size, unsigned int op_mode);
uint64 file_size(unsigned int file_handle);
int file_error(unsigned int file_handle);
int file_stat(char *file_path, void *existing_file_stat_structure);
int file_unlink(char *file_path);
int file_rename(char *file_path_from, char *file_path_to);
int file_mkdir(char *file_path);

void SDS_disable_sdc(unsigned int key);

#pragma endregion