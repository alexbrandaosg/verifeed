
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Eye, Briefcase, MessageSquare, Check, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-purple-50 to-brand-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
            Sistema de Aprovação de
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
              Posts para Redes Sociais
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Simplifique o processo de aprovação entre agência e cliente. 
            Crie campanhas, adicione posts e compartilhe links únicos para aprovação.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="hover:shadow-xl transition-all duration-300 border-primary/20 hover:border-primary/40">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Acesso da Agência</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Crie campanhas, adicione posts com imagens e descrições, 
                e gere links únicos para seus clientes aprovarem.
              </p>
              <Button 
                onClick={() => navigate('/agency')}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Acessar Painel da Agência
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-purple-200 hover:border-purple-400">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Visualização do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Veja como seus clientes visualizam os posts e fazem 
                aprovações ou solicitam alterações.
              </p>
              <Button 
                onClick={() => navigate('/review/demo')}
                variant="outline"
                className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                size="lg"
              >
                <Eye className="w-5 h-5 mr-2" />
                Ver Demo do Cliente
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Crie a Campanha</h3>
              <p className="text-gray-600">
                A agência cria uma nova campanha com os dados do cliente e adiciona todos os posts com imagens e descrições.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Compartilhe o Link</h3>
              <p className="text-gray-600">
                Gere um link único e compartilhe com o cliente para que ele possa revisar todos os posts em uma interface amigável.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Aprove ou Revise</h3>
              <p className="text-gray-600">
                O cliente pode aprovar os posts ou solicitar alterações com feedback detalhado para cada post individual.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center p-6 bg-white/80">
            <Users className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Interface Intuitiva</h3>
            <p className="text-sm text-gray-600">Design pensado para facilitar o uso tanto da agência quanto do cliente</p>
          </Card>
          <Card className="text-center p-6 bg-white/80">
            <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Feedback Detalhado</h3>
            <p className="text-sm text-gray-600">Sistema de comentários para solicitar alterações específicas</p>
          </Card>
          <Card className="text-center p-6 bg-white/80">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Acompanhamento</h3>
            <p className="text-sm text-gray-600">Visualize o status de cada post em tempo real</p>
          </Card>
          <Card className="text-center p-6 bg-white/80">
            <Check className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Processo Ágil</h3>
            <p className="text-sm text-gray-600">Acelere a aprovação e publicação dos seus posts</p>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/agency')}
            size="lg"
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-8 py-3 text-lg"
          >
            Começar Agora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
