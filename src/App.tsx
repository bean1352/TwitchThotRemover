import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react'
import { ThemeProvider } from '@/components/theme-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // Access the data sent from the extension
  console.log(message.data); // "Hello from the extension!"

  // You can also send a response back to the extension if needed
  sendResponse("Message received!");
});

function App() {
  const [bannedWords, setBannedWords] = useState<string[]>([]);
  const [newWord, setNewWord] = useState<string>('');

  useEffect(() => {
    chrome.storage.sync.get('bannedWords', function (data) {
      setBannedWords(data.bannedWords);
    })
  }, [])


  return (
    <ThemeProvider defaultTheme="dark">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Thot Remover</CardTitle>
          <CardDescription>Remove thots from your life</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="title">
            <TabsList>
              <TabsTrigger value="title">Title</TabsTrigger>
              <TabsTrigger value="channel">Channel</TabsTrigger>
            </TabsList>
            <TabsContent value="title">
              <ScrollArea className="rounded-md border max-h-72 overflow-y-auto" >
                <div className="pt-4">
                  <h4 className="ml-4 mb-4 text-sm font-medium leading-none">Titles that include:</h4>
                  <Separator />
                  {bannedWords.map((tag, i) => (
                    <>
                      <div key={tag} className="ml-4 flex justify-between items-center">
                        {tag}
                        <Button variant="ghost" className='p-0 w-10' onClick={() => {
                          chrome.storage.sync.set({ bannedWords: bannedWords.filter((word) => word !== tag) });
                          setBannedWords(bannedWords.filter((word) => word !== tag));
                          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                            chrome.tabs.sendMessage(tabs[0].id ?? 0, { data: '' });
                          });
                        }}>
                          <Trash size={16} />
                        </Button>
                      </div>
                      {i !== bannedWords.length - 1 &&
                        <Separator />}
                    </>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex items-end mt-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  {/* <Label htmlFor="blacklist-word">Blacklist Title</Label> */}
                  <Input type="text" id="blacklist-word" placeholder="Title..." onChange={
                    (e) => {
                      setNewWord(e.target.value);
                    }
                  } value={newWord}
                  />
                </div>
                <Button
                  className='ml-2 w-12 p-0'
                  onClick={() => {
                    chrome.storage.sync.set({ bannedWords: [...bannedWords, newWord] }, function () {
                      console.log('Value is set to ' + [...bannedWords, newWord]);
                    });
                    setBannedWords([...bannedWords, newWord]);
                    setNewWord('');
                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                      chrome.tabs.sendMessage(tabs[0].id ?? 0, { data: newWord });
                    });
                  }}
                >
                  <Plus size={18} />
                </Button>
              </div>

            </TabsContent>
            <TabsContent value="channel">
              arstars
            </TabsContent>
          </Tabs>


        </CardContent>
      </Card>
    </ThemeProvider>
  )
}

export default App
